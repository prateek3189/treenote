import { Category } from "../models/category.model";
import { Request, Response } from "express";
import { ICategory, MessageType } from "../types";

export async function categoryHome(req: Request, res: Response): Promise<void> {
  // Check Authentication
  if (!(req.session as any as any).user) {
    res.redirect("/");
    return;
  }
  let data = (req.session as any as any).additionalInfo;
  if (!data) {
    data = {
      message: "",
      type: "info" as MessageType,
    };
  }
  const categories: ICategory[] = await Category.getAll();

  res.render("categories", {
    categories,
    message: data.message,
    type: data.type,
  });
  (req.session as any).additionalInfo = null;
}

export function addCategoryHome(req: Request, res: Response): void {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }

  res.render("add-category");
}

export async function addCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  const category = new Category(req.body.name);
  await category.save();
  (req.session as any).additionalInfo = {
    message: "Category created successfully.",
    type: "success" as MessageType,
  };
  res.redirect("/categories");
}

export async function editCategoryPage(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  const category = new Category("", req.params.id);
  const categoryData: ICategory | null = await category.getCategory();
  res.render("edit-category", { category: categoryData });
}

export async function updateCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }

  const category = new Category(req.body.name, req.body.id);
  await category.update();

  (req.session as any).additionalInfo = {
    message: "Category updated successfully.",
    type: "success" as MessageType,
  };
  res.redirect("/categories");
}

export async function deleteCategoryController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  try {
    const category = new Category("", req.body.id);
    await category.delete();
    (req.session as any).additionalInfo = {
      message: "Category deleted successfully.",
      type: "success" as MessageType,
    };
    res.redirect("/categories");
  } catch (e) {
    console.log(e);
  }
}
