const Category = require("../models/category.model");
const Contact = require("../models/contact.model");

async function contactHome(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    let data = req.session.additionalInfo;
    if (!data) {
      data = {
        message: "",
        type: "",
      };
    }

    const contacts = await Contact.getAll();
    res.render("contacts", {
      contacts,
      message: data.message,
      type: data.type,
    });
    req.session.additionalInfo = null;
    return;
  } catch (e) {
    console.log(e);
  }
}

async function addContactHome(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const categories = await Category.getAll();
  res.render("add-contact", { categories });
}

async function addContactController(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  const contact = new Contact(
    req.body.name,
    req.body.phone,
    req.body.category,
    req.file.path
  );

  await contact.save();
  req.session.additionalInfo = {
    message: "Contact created successfully.",
    type: "success",
  };
  res.redirect("/contacts");
}

async function editContactPage(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const categories = await Category.getAll();

    const contact = new Contact(null, null, null, null, req.params.id);
    const contactData = await contact.getContact();
    res.render("edit-contact", { contact: contactData, categories });
  } catch (e) {
    console.log(e);
  }
}

async function updateContactController(req, res) {
  // Check Authentication
  if (!req.session.user) {
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

    req.session.additionalInfo = {
      message: "Contact updated successfully.",
      type: "success",
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
}

async function deleteContactController(req, res) {
  // Check Authentication
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  try {
    const contact = new Contact(null, null, null, null, req.body.id);
    await contact.delete();
    req.session.additionalInfo = {
      message: "Contact deleted successfully.",
      type: "success",
    };
    res.redirect("/contacts");
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  contactHome,
  addContactHome,
  addContactController,
  editContactPage,
  updateContactController,
  deleteContactController,
};
