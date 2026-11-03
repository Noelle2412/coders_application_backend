// In-memory challenges storage
export const challenges = [];

export const createChallenge = async (req, res) => {
  try {
    const { title, category, description, level, code, tests } = req.body;
    const newChallenge = {
      title,
      category,
      description,
      level,
      code,
      tests,
    };
    challenges.push(newChallenge);
    res.status(201).json({
      status: "success",
      message: "Challenge created successfully",
      data: newChallenge,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the challenge",
    });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    if (req.query.category) {
      const filteredChallenges = challenges.filter(
        (challenge) => challenge.category === req.query.category,
      );
      return res.status(200).json({
        status: "success",
        message: "Challenges retrieved successfully",
        data: filteredChallenges,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Challenges retrieved successfully",
      data: challenges,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving challenges",
    });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challenge = challenges.find((c) => c.id === req.params.id);
    if (!challenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Challenge retrieved successfully",
      data: challenge,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the challenge",
    });
  }
};

export const deleteChallengeById = async (req, res) => {
  try {
    const challengeIndex = challenges.findIndex((c) => c.id === req.params.id);
    if (challengeIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    challenges.splice(challengeIndex, 1);
    res.status(200).json({
      status: "success",
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the challenge",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = [...new Set(challenges.map((c) => c.category))];
    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving categories",
    });
  }
};

export const submitChallenge = async (req, res) => {
  try {
    const { lang, code, challengeId } = req.body;
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    // Here you would typically run the code against the challenge's tests
    // For simplicity, we'll just return a success message
    res.status(200).json({
      status: "success",
      message: "Challenge submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while submitting the challenge",
    });
  }
};
