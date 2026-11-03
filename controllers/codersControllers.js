// In-memory coders storage
export const coders = [];

export const codersRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingCoder = coders.find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingCoder) {
      return res.status(409).json({
        status: "fail",
        message: "Coder with this email already exists",
      });
    }

    const newCoder = {
      id: coders.length + 1,
      firstName,
      lastName,
      email,
      password,
      role: "coder",
    };

    coders.push(newCoder);

    const { password: _, ...coderData } = newCoder;

    return res.status(201).json({
      status: "success",
      message: "Coder registered successfully",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during coder registration",
      error: error.message,
    });
  }
};

export const codersLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const coder = coders.find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );

    if (!coder || coder.password !== password) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const { password: _, ...coderData } = coder;

    return res.status(200).json({
      status: "success",
      message: "Coder logged in successfully",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during coder login",
      error: error.message,
    });
  }
};

export const getCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const coder = coders.find((c) => c.id === parseInt(id));
    if (!coder) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }
    const { password: _, ...coderData } = coder;
    return res.status(200).json({
      status: "success",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the coder",
      error: error.message,
    });
  }
};

export const updateCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const coderIndex = coders.findIndex((c) => c.id === parseInt(id));
    if (coderIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }
    const { about, firstName, lastName } = req.body;
    const updatedCoder = {
      about,
      firstName,
      lastName,
      ...coders[coderIndex],
    };
    coders[coderIndex] = updatedCoder;
    const { password: _, ...coderData } = updatedCoder;
    return res.status(200).json({
      status: "success",
      message: "Coder updated successfully",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the coder",
      error: error.message,
    });
  }
};

export const deleteCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const coderIndex = coders.findIndex((c) => c.id === parseInt(id));
    if (coderIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }
    coders.splice(coderIndex, 1);
    return res.status(200).json({
      status: "success",
      message: "Coder deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the coder",
      error: error.message,
    });
  }
};
