import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["en cours", "terminée"],
      default: "en cours",
    },
    priority: {
      type: String,
      enum: ["basse", "moyenne", "haute"],
      default: "moyenne",
    },
  },
  {
    timestamps: true,
  }
);

// Index pour accélérer les requêtes par utilisateur
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;