import Task from "../models/Task.js";
import mongoose from "mongoose";

// ==================================================
// @desc    Créer une nouvelle tâche
// @route   POST /api/tasks
// @access  Privé
// ==================================================
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Le titre est requis" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Récupérer toutes les tâches de l'utilisateur
//          + filtrage et tri (étape 5)
// @route   GET /api/tasks
// @access  Privé
// ==================================================
export const getTasks = async (req, res, next) => {
  try {
    const { status, search, sortBy } = req.query;

    const filter = { user: req.user._id };

    // Filtre par statut
    if (status && status !== "toutes") {
      filter.status = status;
    }

    // Recherche par titre ou description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Tri
    let sort = { createdAt: -1 }; // par défaut : plus récentes d'abord
    if (sortBy === "dueDate") sort = { dueDate: 1 };
    if (sortBy === "priority") sort = { priority: -1 };
    if (sortBy === "title") sort = { title: 1 };
    if (sortBy === "oldest") sort = { createdAt: 1 };

    const tasks = await Task.find(filter).sort(sort);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Récupérer une tâche par ID
// @route   GET /api/tasks/:id
// @access  Privé
// ==================================================
export const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    // Vérifier que la tâche appartient à l'utilisateur connecté
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Mettre à jour une tâche
// @route   PUT /api/tasks/:id
// @access  Privé
// ==================================================
export const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const { title, description, dueDate, priority, status } = req.body;

    // Mettre à jour seulement les champs fournis
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Privé
// ==================================================
export const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await task.deleteOne();
    res.json({ message: "Tâche supprimée avec succès", _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Basculer le statut d'une tâche
//          en cours ⇄ terminée
// @route   PATCH /api/tasks/:id/toggle
// @access  Privé
// ==================================================
export const toggleTaskStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    task.status = task.status === "en cours" ? "terminée" : "en cours";
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};