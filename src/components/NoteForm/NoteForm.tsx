import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { useId } from "react";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long.")
    .max(50, "Title cannot exceed 50 characters.")
    .required("Title is required."),
  content: Yup.string().max(500, "Content must not exceed 500 characters."),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Tag must be one of the allowed values."
    )
    .required("Please select one of the options."),
});

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}

type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createNote({
        titleNote: values.title,
        tagNote: values.tag,
        contentNote: values.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >
      {({ isValid, isSubmitting }) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                className={css.error}
                component="span"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
                as="textarea"
              />
              <ErrorMessage
                name="content"
                className={css.error}
                component="span"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                id={`${fieldId}-tag`}
                name="tag"
                className={css.select}
                as="select"
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" className={css.error} component="span" />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={!isValid || isSubmitting}
              >
                Create note
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
