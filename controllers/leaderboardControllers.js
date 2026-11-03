const fetchLeaderboardData = async () => {
  // Simulate fetching leaderboard data from a database or external API
  return [
    { id: 1, name: "Alice", score: 100 },
    { id: 2, name: "Bob", score: 90 },
    { id: 3, name: "Charlie", score: 80 },
  ];
};

export const getLeaderboard = async (req, res) => {
  try {
    // Assuming you have a function to fetch leaderboard data
    const leaderboardData = await fetchLeaderboardData();
    res.status(200).json({
      status: "success",
      message: "Leaderboard retrieved successfully",
      data: leaderboardData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the leaderboard",
    });
  }
};

export const getTopCoders = async (req, res) => {
  try {
    // Assuming you have a function to fetch leaderboard data
    const leaderboardData = await fetchLeaderboardData();
    // Sort the data by score in descending order and take the top K
    const K = req.query.K ? parseInt(req.query.K) : 3; // Default to top 3 if K is not provided
    const topCoders = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, K);
    res.status(200).json({
      status: "success",
      message: "Top coders retrieved successfully",
      data: topCoders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the top coders",
    });
  }
};
