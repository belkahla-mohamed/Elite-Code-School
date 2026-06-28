import type { Prisma } from "@prisma/client";

// Re-export Prisma-generated types for frontend use
export type {
  Program,
  InscriptionRequest,
  Student,
  Project,
  Certification,
  GalleryItem,
} from "@prisma/client";

export type {
  ProgramLevel,
  RequestStatus,
  ProjectStatus,
} from "@prisma/client";

// Domain-specific types for API responses (includes relations)
export type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    program: true;
    projects: true;
    certifications: true;
    galleryItems: true;
  };
}>;

export type ProgramWithStudents = Prisma.ProgramGetPayload<{
  include: {
    students: true;
  };
}>;

export type InscriptionRequestWithProgram = Prisma.InscriptionRequestGetPayload<{
  include: {
    program: true;
  };
}>;

// Input types for API mutations (subset of full model)
export type CreateInscriptionInput = Pick<
  Prisma.InscriptionRequestCreateInput,
  "studentFirstName" | "studentLastName" | "age" | "schoolLevel" | "parentPhone" | "parentEmail" | "message"
> & { programId: string };

export type CreateProjectInput = Pick<
  Prisma.ProjectCreateInput,
  "title" | "description" | "tags" | "status" | "progress" | "dateLabel" | "emoji" | "gradient"
>;

export type CreateCertificationInput = Pick<
  Prisma.CertificationCreateInput,
  "title" | "mention" | "dateLabel" | "emoji" | "gradient"
>;

export type CreateGalleryInput = Pick<
  Prisma.GalleryItemCreateInput,
  "label" | "emoji" | "gradient"
>;
