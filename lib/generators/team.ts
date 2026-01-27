import { createPRNG, stableStringify } from '../prng';

export interface TeamGeneratorParams {
  members: string[];
  teamCount: number;
  balanced?: boolean;
  seed?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
}

export interface TeamGeneratorResult {
  teams: Team[];
}

/**
 * Generate a deterministic seed from base seed + params
 */
function getCombinedSeed(baseSeed: string, params: Omit<TeamGeneratorParams, 'seed'>): string {
  const paramsStr = stableStringify(params);
  return `${baseSeed}|${paramsStr}`;
}

export function generateTeams(params: TeamGeneratorParams): TeamGeneratorResult {
  const { members, teamCount, balanced = true, seed: baseSeed } = params;
  
  if (members.length === 0) {
    return { teams: [] };
  }

  if (teamCount < 1) {
    return { teams: [] };
  }

  // Generate deterministic seed from base seed + params
  const paramsForSeed = { members, teamCount, balanced };
  const combinedSeed = baseSeed 
    ? getCombinedSeed(baseSeed, paramsForSeed)
    : `${Date.now()}-${Math.random()}`;
  
  const prng = createPRNG(combinedSeed);

  // Shuffle members using Fisher-Yates
  const shuffled = [...members];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = prng.nextInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Distribute members to teams
  const teams: Team[] = [];
  const membersPerTeam = balanced 
    ? Math.floor(members.length / teamCount)
    : 0;
  const remainder = balanced 
    ? members.length % teamCount 
    : 0;

  let memberIndex = 0;

  for (let i = 0; i < teamCount; i++) {
    const teamMembers: string[] = [];
    
    if (balanced) {
      // Balanced distribution
      const count = membersPerTeam + (i < remainder ? 1 : 0);
      for (let j = 0; j < count && memberIndex < shuffled.length; j++) {
        teamMembers.push(shuffled[memberIndex]);
        memberIndex++;
      }
    } else {
      // Random distribution
      const remainingMembers = shuffled.length - memberIndex;
      const remainingTeams = teamCount - i;
      
      if (remainingTeams === 1) {
        // Last team gets all remaining members
        while (memberIndex < shuffled.length) {
          teamMembers.push(shuffled[memberIndex]);
          memberIndex++;
        }
      } else {
        // Random count for this team
        const maxForThisTeam = remainingMembers - (remainingTeams - 1);
        const count = maxForThisTeam > 1 
          ? prng.nextInt(1, maxForThisTeam)
          : 1;
        
        for (let j = 0; j < count && memberIndex < shuffled.length; j++) {
          teamMembers.push(shuffled[memberIndex]);
          memberIndex++;
        }
      }
    }

    teams.push({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      members: teamMembers,
    });
  }

  return { teams };
}
