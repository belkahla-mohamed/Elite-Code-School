import { z } from "zod";

const frenchErrorMap: z.ZodErrorMap = (issue, _ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "null" || issue.received === "undefined") {
        return { message: "Ce champ est requis" };
      }
      if (issue.expected === "number") return { message: "Nombre invalide" };
      if (issue.expected === "integer") return { message: "Nombre entier invalide" };
      if (issue.expected === "string") return { message: "Texte invalide" };
      if (issue.expected === "boolean") return { message: "Choix invalide" };
      return { message: "Valeur invalide" };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return {
          message:
            issue.minimum === 1
              ? "Ce champ est requis"
              : `Trop court : au moins ${issue.minimum} caractères requis`,
        };
      }
      if (issue.type === "number") {
        return { message: `Valeur minimum : ${issue.minimum}` };
      }
      return { message: `Valeur trop petite (minimum ${issue.minimum})` };
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Trop long : ${issue.maximum} caractères maximum` };
      }
      if (issue.type === "number") {
        return { message: `Valeur maximum : ${issue.maximum}` };
      }
      return { message: `Valeur trop grande (maximum ${issue.maximum})` };
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Valeur non autorisée pour ce champ" };
    case z.ZodIssueCode.invalid_literal:
      return { message: "Valeur invalide" };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") return { message: "Adresse email invalide" };
      if (issue.validation === "url") return { message: "Lien invalide (commencez par https://)" };
      if (issue.validation === "date") return { message: "Date invalide" };
      if (issue.validation === "time") return { message: "Heure invalide" };
      return { message: "Format invalide" };
    case z.ZodIssueCode.unrecognized_keys:
      return { message: "Champ inconnu dans les données" };
    case z.ZodIssueCode.invalid_union:
      return { message: "Valeur invalide" };
    case z.ZodIssueCode.custom:
      return { message: issue.message || "Valeur invalide" };
    default:
      return { message: "Données invalides" };
  }
};

z.setErrorMap(frenchErrorMap);
