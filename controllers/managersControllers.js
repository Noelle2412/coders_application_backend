// In-memory managers storage
export const managers = [];

export const managersRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingManager = managers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingManager) {
      return res.status(409).json({
        status: "fail",
        message: "Manager with this email already exists",
      });
    }
    const newManager = {
      id: managers.length + 1,
      firstName,
      lastName,
      email,
      password,
      role: "manager",
    };
    managers.push(newManager);
    const { password: _, ...managerData } = newManager;
    return res.status(201).json({
      status: "success",
      message: "Manager registered successfully",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during manager registration",
      error: error.message,
    });
  }
};

export const managersLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = managers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase(),
    );
    if (!manager || manager.password !== password) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const { password: _, ...managerData } = manager;
    return res.status(200).json({
      status: "success",
      message: "Manager logged in successfully",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during manager login",
      error: error.message,
    });
  }
};

export const getManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = managers.find((m) => m.id === parseInt(id));
    if (!manager) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }
    const { password: _, ...managerData } = manager;
    return res.status(200).json({
      status: "success",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the manager",
      error: error.message,
    });
  }
};

export const updateManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const managerIndex = managers.findIndex((m) => m.id === parseInt(id));
    if (managerIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }
    const { about, firstName, lastName } = req.body;
    const updatedManager = {
      about,
      firstName,
      lastName,
      ...managers[managerIndex],
    };
    managers[managerIndex] = updatedManager;
    const { password: _, ...managerData } = updatedManager;
    return res.status(200).json({
      status: "success",
      message: "Manager updated successfully",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the manager",
      error: error.message,
    });
  }
};

export const deleteManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const managerIndex = managers.findIndex((m) => m.id === parseInt(id));
    if (managerIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }
    managers.splice(managerIndex, 1);
    return res.status(200).json({
      status: "success",
      message: "Manager deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the manager",
      error: error.message,
    });
  }
};
