/**
 * GitHub API utility functions for fetching real data.
 * These functions use the GitHub token stored in the session.
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

/**
 * Fetch repositories for the authenticated user
 */
export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

/**
 * Fetch recent commits for a specific repository
 */
export async function fetchRepoCommits(token: string, owner: string, repo: string): Promise<GitHubCommit[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    return [];
  }
}

/**
 * Fetch all events for the authenticated user (useful for the activity feed)
 */
export async function fetchUserEvents(token: string, username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub events:", error);
    return [];
  }
}

/**
 * Fetch organizations the user is a member of
 */
export async function fetchUserOrgs(token: string) {
  try {
    const response = await fetch("https://api.github.com/user/orgs", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub orgs:", error);
    return [];
  }
}

/**
 * Fetch teams for a specific organization
 */
export async function fetchOrgTeams(token: string, org: string) {
  try {
    const response = await fetch(`https://api.github.com/orgs/${org}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub teams:", error);
    return [];
  }
}

/**
 * Fetch contributors for a specific repository
 */
export async function fetchRepoMembers(token: string, owner: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const contributors = await response.json();
    return contributors.map((c: any) => ({
      id: c.id.toString(),
      name: c.login,
      role: "Developer",
      avatarUrl: c.avatar_url,
      githubUsername: c.login,
      status: "active",
      tasks: [],
      skills: ["GitHub Contributor"],
      productivity: Math.floor(Math.random() * 20) + 80, // Mock productivity for these members
    }));
  } catch (error) {
    console.error("Error fetching GitHub members:", error);
    return [];
  }
}
