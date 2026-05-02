interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FormField {
  id: string;
  formId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Form {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

interface Submission {
  id: string;
  formId: string;
  data: string;
  createdAt: Date;
}

interface Database {
  users: User[];
  forms: Form[];
  submissions: Submission[];
}

let database: Database = {
  users: [],
  forms: [],
  submissions: [],
};

function generateId(): string {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function now(): Date {
  return new Date();
}

export const db = {
  users: {
    create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const user: User = {
        id: generateId(),
        ...data,
        createdAt: now(),
        updatedAt: now(),
      };
      database.users.push(user);
      return user;
    },
    findUnique: (where: { email?: string; id?: string }) => {
      if (where.email) {
        return database.users.find(u => u.email === where.email) || null;
      }
      if (where.id) {
        return database.users.find(u => u.id === where.id) || null;
      }
      return null;
    },
    findMany: () => {
      return database.users;
    },
  },
  forms: {
    create: (data: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'fields'>) => {
      const form: Form = {
        id: generateId(),
        ...data,
        fields: [],
        createdAt: now(),
        updatedAt: now(),
      };
      database.forms.push(form);
      return form;
    },
    findUnique: (where: { id: string }) => {
      return database.forms.find(f => f.id === where.id) || null;
    },
    findMany: (where?: { userId?: string }) => {
      if (where?.userId) {
        return database.forms.filter(f => f.userId === where.userId);
      }
      return database.forms;
    },
    update: (where: { id: string }, data: Partial<Omit<Form, 'id' | 'createdAt' | 'fields'>>) => {
      const index = database.forms.findIndex(f => f.id === where.id);
      if (index !== -1) {
        database.forms[index] = {
          ...database.forms[index],
          ...data,
          updatedAt: now(),
        };
        return database.forms[index];
      }
      return null;
    },
    delete: (where: { id: string }) => {
      const index = database.forms.findIndex(f => f.id === where.id);
      if (index !== -1) {
        const deleted = database.forms[index];
        database.forms.splice(index, 1);
        database.submissions = database.submissions.filter(s => s.formId !== where.id);
        return deleted;
      }
      return null;
    },
    addField: (formId: string, field: Omit<FormField, 'id' | 'formId' | 'createdAt' | 'updatedAt'>) => {
      const form = database.forms.find(f => f.id === formId);
      if (form) {
        const newField: FormField = {
          id: generateId(),
          formId,
          ...field,
          createdAt: now(),
          updatedAt: now(),
        };
        form.fields.push(newField);
        form.updatedAt = now();
        return newField;
      }
      return null;
    },
    updateField: (formId: string, fieldId: string, data: Partial<Omit<FormField, 'id' | 'formId' | 'createdAt'>>) => {
      const form = database.forms.find(f => f.id === formId);
      if (form) {
        const fieldIndex = form.fields.findIndex(ff => ff.id === fieldId);
        if (fieldIndex !== -1) {
          form.fields[fieldIndex] = {
            ...form.fields[fieldIndex],
            ...data,
            updatedAt: now(),
          };
          form.updatedAt = now();
          return form.fields[fieldIndex];
        }
      }
      return null;
    },
    deleteField: (formId: string, fieldId: string) => {
      const form = database.forms.find(f => f.id === formId);
      if (form) {
        const fieldIndex = form.fields.findIndex(ff => ff.id === fieldId);
        if (fieldIndex !== -1) {
          const deleted = form.fields[fieldIndex];
          form.fields.splice(fieldIndex, 1);
          form.updatedAt = now();
          return deleted;
        }
      }
      return null;
    },
  },
  submissions: {
    create: (data: Omit<Submission, 'id' | 'createdAt'>) => {
      const submission: Submission = {
        id: generateId(),
        ...data,
        createdAt: now(),
      };
      database.submissions.push(submission);
      return submission;
    },
    findUnique: (where: { id: string }) => {
      return database.submissions.find(s => s.id === where.id) || null;
    },
    findMany: (where?: { formId?: string }) => {
      if (where?.formId) {
        return database.submissions.filter(s => s.formId === where.formId);
      }
      return database.submissions;
    },
    delete: (where: { id: string }) => {
      const index = database.submissions.findIndex(s => s.id === where.id);
      if (index !== -1) {
        const deleted = database.submissions[index];
        database.submissions.splice(index, 1);
        return deleted;
      }
      return null;
    },
  },
  initialize: () => {
    database.users = [
      {
        id: 'cmntkmvhf0000bw3j0buw0qhc',
        email: 'arthurspecht5@gmail.com',
        name: 'Arthur Specht',
        password: 'Arthur10',
        createdAt: new Date('2026-04-10T21:03:02.000Z'),
        updatedAt: new Date('2026-04-10T21:03:02.000Z'),
      },
    ];
  },
};

db.initialize();
