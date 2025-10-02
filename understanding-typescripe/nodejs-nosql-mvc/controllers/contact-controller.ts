import { Category } from "../models/category.model";
import { Contact } from "../models/contact.model";
import { Request, Response } from "express";
import {
  ICategory,
  IContact,
  IContactWithCategory,
  MessageType,
} from "../types";

export async function contactHome(req: Request, res: Response): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  try {
    let data = (req.session as any).additionalInfo;
    if (!data) {
      data = {
        message: "",
        type: "info" as MessageType,
      };
    }

    const contacts: IContactWithCategory[] = await Contact.getAll();
    res.render("contacts", {
      contacts,
      message: data.message,
      type: data.type,
    });
    (req.session as any).additionalInfo = null;
    return;
  } catch (e) {
    console.log(e);
  }
}

export async function addContactHome(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  const categories: ICategory[] = await Category.getAll();
  res.render("add-contact", { categories });
}

export async function addContactController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }

  const contact = new Contact(
    req.body.name,
    req.body.phone,
    req.body.category,
    req.file?.path || ""
  );

  await contact.save();
  (req.session as any).additionalInfo = {
    message: "Contact created successfully.",
    type: "success" as MessageType,
  };
  res.redirect("/contacts");
}

export async function editContactPage(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  try {
    const categories: ICategory[] = await Category.getAll();

    const contact = new Contact("", "", "", "", req.params.id);
    const contactData: IContact | null = await contact.getContact();
    res.render("edit-contact", { contact: contactData, categories });
  } catch (e) {
    console.log(e);
  }
}

export async function updateContactController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  try {
    const avatar = req.file;
    const contact = new Contact(
      req.body.name,
      req.body.phone,
      req.body.category,
      avatar ? avatar.path : "",
      req.body.id
    );
    await contact.update();

    (req.session as any).additionalInfo = {
      message: "Contact updated successfully.",
      type: "success" as MessageType,
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
}

export async function deleteContactController(
  req: Request,
  res: Response
): Promise<void> {
  // Check Authentication
  if (!(req.session as any).user) {
    res.redirect("/");
    return;
  }
  try {
    const contact = new Contact("", "", "", "", req.body.id);
    await contact.delete();
    (req.session as any).additionalInfo = {
      message: "Contact deleted successfully.",
      type: "success" as MessageType,
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
}
