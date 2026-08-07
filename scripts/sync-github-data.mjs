import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const organization = process.env.COMMUNITY_ORG || 'Spark-Relics';
const personalRepoOwner = process.env.PERSONAL_REPO_OWNER || 'ad-naan';
const founderLogin = process.env.FOUNDER_LOGIN || 'ad-naan';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const outputPath = resolve(process.cwd(), 'src/data/github-community.json');
const apiVersion = process.env.GITHUB_API_VERSION || '2022-11-28';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'Spark-Relics-Community-Sync',
  'X-GitHub-Api-Version': apiVersion,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

let existingData = null;
try {
  existingData = JSON.parse(await readFile(outputPath, 'utf8'));
} catch {
  // The first sync starts without a generated snapshot.
}

const request = async (path, { optional = false } = {}) => {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    if (optional) return null;
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${path}: ${body.slice(0, 240)}`);
  }
  if (response.status === 204) return [];
  const body = await response.text();
  return body ? JSON.parse(body) : [];
};

const paginate = async (path, { optional = false } = {}) => {
  const separator = path.includes('?') ? '&' : '?';
  const results = [];
  for (let page = 1; page <= 20; page += 1) {
    const batch = await request(`${path}${separator}per_page=100&page=${page}`, { optional });
    if (!batch) return [];
    results.push(...batch);
    if (batch.length < 100) break;
  }
  return results;
};

const fallbackToExisting = async (error) => {
  try {
    if (existingData?.members?.length || existingData?.projects?.length) {
      console.warn(`GitHub sync skipped; retaining existing data. ${error.message}`);
      return true;
    }
  } catch {
    // No usable generated data exists yet.
  }
  return false;
};

const unique = (values) => [...new Set(values.filter(Boolean))];

try {
  const viewer = token ? await request('/user', { optional: true }) : null;
  const canSyncConcealedMembers = viewer?.login?.toLowerCase() === organization.toLowerCase()
    || viewer?.login?.toLowerCase() === founderLogin.toLowerCase()
    || Boolean(token);
  let memberSummaries = [];
  if (canSyncConcealedMembers) {
    memberSummaries = await paginate(`/orgs/${organization}/members?filter=all`, { optional: true });
  }
  if (!memberSummaries.length) {
    memberSummaries = await paginate(`/orgs/${organization}/public_members`);
  }

  let members = [];
  for (const member of memberSummaries) {
    const profile = await request(`/users/${encodeURIComponent(member.login)}`, { optional: true });
    members.push({
      login: member.login,
      name: profile?.name || member.login,
      avatarUrl: profile?.avatar_url || member.avatar_url,
      profileUrl: profile?.html_url || member.html_url,
      bio: profile?.bio || '',
      company: profile?.company || '',
      location: profile?.location || '',
      blog: profile?.blog || '',
      followers: profile?.followers || 0,
      following: profile?.following || 0,
      publicRepos: profile?.public_repos || 0,
      joinedAt: profile?.created_at || null,
      role: member.login.toLowerCase() === founderLogin.toLowerCase() ? 'Founder' : 'Member',
    });
  }
  if ((existingData?.members?.length || 0) > members.length) {
    members = existingData.members;
    console.warn('Keeping the richer checked-in member snapshot; configure COMMUNITY_GITHUB_TOKEN to refresh concealed memberships.');
  }

  const organizationRepos = await paginate(`/orgs/${organization}/repos?type=public&sort=updated&direction=desc`);
  const personalRepos = (await paginate(`/users/${personalRepoOwner}/repos?type=owner&sort=updated&direction=desc`))
    .filter((repo) => !repo.private)
    .sort((a, b) => Number(b.stargazers_count) - Number(a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
  const sourceRepos = [...new Map([...organizationRepos, ...personalRepos]
    .filter((repo) => !repo.private)
    .map((repo) => [repo.full_name, repo])).values()];
  const contributorIds = new Set();
  for (const repo of sourceRepos) {
    const contributors = await paginate(`/repos/${repo.full_name}/contributors?anon=1`, { optional: true });
    contributors.forEach((contributor) => contributorIds.add(contributor.id ? `user:${contributor.id}` : `anon:${contributor.name}`));
  }

  const projectImages = [
    '/assets/spark/generated/project-agent-v3.jpg',
    '/assets/spark/generated/project-forge-v3.jpg',
    '/assets/spark/generated/project-memory-v3.jpg',
    '/assets/spark/generated/project-studio-v3.jpg',
  ];
  const imageFor = (name) => {
    const hash = [...name].reduce((total, character) => total + character.charCodeAt(0), 0);
    return projectImages[hash % projectImages.length];
  };

  const projects = sourceRepos
    .sort((a, b) => Number(b.stargazers_count) - Number(a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at))
    .map((repo) => ({
      owner: repo.owner?.login || organization,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || `${repo.language || 'Software'} project maintained by ${repo.owner?.login || organization}.`,
      url: repo.private ? null : repo.html_url,
      homepage: repo.private ? null : repo.homepage || null,
      private: Boolean(repo.private),
      language: repo.language || 'Code',
      topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      openIssues: repo.open_issues_count || 0,
      updatedAt: repo.updated_at,
      image: imageFor(repo.full_name),
    }));

  const publicProjects = projects.filter((project) => !project.private);
  const locations = unique(members.map((member) => member.location));
  const data = {
    generatedAt: new Date().toISOString(),
    organization,
    personalRepoOwner,
    founderLogin,
    members,
    projects,
    stats: {
      creators: members.length,
      projects: projects.length,
      openSourceProjects: publicProjects.length,
      privateProjects: projects.length - publicProjects.length,
      stars: projects.reduce((total, project) => total + project.stars, 0),
      contributors: contributorIds.size,
      locations: locations.length,
    },
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Synced ${members.length} members and ${projects.length} repositories to ${outputPath}.`);
} catch (error) {
  if (!(await fallbackToExisting(error))) throw error;
}
