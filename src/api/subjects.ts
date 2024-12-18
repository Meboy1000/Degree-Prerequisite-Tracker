import express from "express";
import sql from "../database.js";
import { Courses } from "../schema.js";
import createHttpError from "http-errors";

const router = express.Router();
export default router;

interface Subject {
  department_id: number;
  name: string;
  prefix: string;
}

router.get("/subjects", async (req, res) => {
  const subjects = await sql<Subject[]>`
    SELECT department_id, name, prefix FROM subjects
  `;

  res.send(
    subjects.map((subject) => ({
      departmentId: subject.department_id,
      name: subject.name,
      prefix: subject.prefix,
    })),
  );
});

router.get("/subjects/:prefix/courses", async (req, res) => {
  const prefix = req.params.prefix.toUpperCase();

  const courses = await sql<Pick<Courses, "id" | "name" | "number">[]>`
    SELECT id, name, number FROM courses WHERE prefix = ${prefix}
  `;

  if (courses.length === 0) {
    throw createHttpError.NotFound(`No courses associated with prefix "${prefix}" `);
  }

  res.send(
    courses.map((course) => ({
      courseId: course.id,
      courseName: course.name,
      courseNumber: course.number,
    })),
  );
});
