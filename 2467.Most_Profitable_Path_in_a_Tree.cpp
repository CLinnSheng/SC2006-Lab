#include <climits>
#include <deque>
#include <unordered_map>
#include <vector>
using std::vector;

/*
 * Every node i, there is a gate & amount[i] represent:
 * - Price needed to open the gate at node i (amount[i] < 0)
 * - Reward obtained in opening the gate at node i (amount[i] > 0)
 * Initially, Alice is at node 0 and Bob is at node 'Bob'
 * Alice goal is to move to leaf node while Bob is trying move to node 0
 * If Alice & Bob reach the same node simultaneously, they will share the price or reward for opening the gate
 * If they reach their end node then they wont be moving anymore.
 * NOTE: If gate is open then no price nor reward.
 *
 * Goal: Return the maximum net income Alice can have if she travel towards the optimal leaft node.
 *
 * Intuition:
 * Bob only has 1 path which is from 'bob' to node '0'
 * Howeve Alice has multiple path, so we need to find the optimal 1. My initial thought is by using dijkstra to maximize
 * the reward but some of the value is negative and also the reward/time constraint thus we cannot use dijkstra.
 *
 * Through observation, we notice that Alice has the choices to choose what path she want however Bob
 * doesnt have the choice, it can only go to '0' because of tree properties --> no cycle
 * So we can use dfs to find Bob path. However, do we really need to compute out Bob profit for the traverse? Actually
 * no, we only need the information of the time when it travel to a certain node because our objective is to findout
 * Alice reward. So when we run the stimulation of Alice traversal, we can use the time tracked from the Bob traversal
 * to determine the price/reward for each node. For Alice traversal, we just have to simply try out every single path
 * and get the maximum reward
 *
 * Time Complexity: O(V + E) --> Travelling every single path so all edges & nodes
 * */
class Solution
{
  private:
    bool findBobPath(std::unordered_map<int, int> &bobPathTime, vector<bool> &visitedBob,
                     const vector<vector<int>> &adjList, const int &currNode, const int &time)
    {
        bobPathTime[currNode] = time;
        visitedBob[currNode] = true;

        // reach the destination node
        if (currNode == 0)
            return true;

        for (const auto &neighNode : adjList[currNode])
        {
            // only traverse if never traverse before
            if (!visitedBob[neighNode])
            {
                // means the path chosen is correct
                if (findBobPath(bobPathTime, visitedBob, adjList, neighNode, time + 1))
                    return true;
            }
        }

        // means that this path is not correct (probably go to other leaf node)
        // so remove from the map and return false so that we dont choose this path & doesnt need the information for it
        bobPathTime.erase(currNode);
        return false;
    }

  public:
    int mostProfitablePath(vector<vector<int>> &edges, int bob, vector<int> &amount)
    {
        // build the adjList
        int n(amount.size());
        vector<vector<int>> adjList(n);
        for (const auto &edge : edges)
        {
            adjList[edge[0]].emplace_back(edge[1]);
            adjList[edge[1]].emplace_back(edge[0]);
        }

        std::unordered_map<int, int> bobPathTime;
        vector<bool> visited(n, false);

        findBobPath(bobPathTime, visited, adjList, bob, 0);

        // reuse for alice simulation
        visited.assign(n, false);

        // now we have the information of Bob Path
        // Just run the simulation of Alice path and calculate its reward or price through the information we have right
        // now
        // can use either bfs or dfs
        std::deque<vector<int>> queue;
        // currNode, Time, Reward
        queue.push_back({0, 0, 0});

        int reward{INT_MIN};

        // run bfs
        while (!queue.empty())
        {
            auto top{queue.front()};
            queue.pop_front();

            int currNode{top[0]}, currTime{top[1]}, currReward{top[2]};

            // Checking of simulation with the given condition
            // 1. Alice reach it first or Bob never pass through this node
            if (bobPathTime.find(currNode) == bobPathTime.end() || currTime < bobPathTime[currNode])
            {
                currReward += amount[currNode];
            }
            // 2. They both reach at the same time
            else if (currTime == bobPathTime[currNode])
            {
                currReward += amount[currNode] / 2;
            }
            // 3. Alice visit it after Bob, so no need to pay or have reward

            // update the maximum reward if reach the leaf node
            if (adjList[currNode].size() == 1 && currNode != 0)
            {
                reward = std::max(reward, currReward);
                // try out other path
                visited[currNode] = true;
                continue;
            }

            // if havent reach leaf node, continue exploring all possible path
            for (const auto &neighNode : adjList[currNode])
                if (!visited[neighNode])
                    queue.push_back({neighNode, currTime + 1, currReward});

            visited[currNode] = true;
        }
        return reward;
    }
};
