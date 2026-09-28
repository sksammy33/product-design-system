import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Input } from '../Input/Input';
import type { InputProps } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import type { TextareaProps } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import type { ButtonProps } from '../Button/Button';
import styles from './Forms.module.css';

const classes = (...values: (string | undefined)[]) => values.filter(Boolean).join(' ');
export type FormFieldProps = ({ control?: 'input' } & InputProps) | ({ control: 'textarea' } & TextareaProps);
/** A field delegates labels, validation, refs and native form behavior to the existing controls. */
export function FormField(props: FormFieldProps) {
  if (props.control === 'textarea') {
    const { control: _, ...rest } = props;
    return <Textarea {...rest} />;
  }
  const { control: _, ...rest } = props;
  return <Input {...rest} />;
}

export type FormGroupProps = ComponentPropsWithRef<'div'> & { direction?: 'vertical' | 'horizontal' };
export function FormGroup({ direction = 'vertical', className, ...props }: FormGroupProps) {
  return <div {...props} className={classes(styles.group, className)} data-direction={direction} />;
}
export type FormRowProps = ComponentPropsWithRef<'div'> & { columns?: 1 | 2 | 3 };
export function FormRow({ columns = 1, className, ...props }: FormRowProps) {
  return <div {...props} className={classes(styles.row, className)} data-columns={columns} />;
}

type HeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};
export type FormSectionProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & HeadingProps;
export function FormSection({ title, description, headingLevel = 3, children, className, ...props }: FormSectionProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;
  return <section aria-labelledby={titleId} {...props} className={classes(styles.section, className)}>
    <Heading id={titleId} className={styles.sectionTitle}>{title}</Heading>
    {description && <p className={styles.description}>{description}</p>}
    <div className={styles.divider} />
    {children}
  </section>;
}
export type FormHeaderProps = Omit<ComponentPropsWithRef<'header'>, 'title'> & HeadingProps;
export function FormHeader({ title, description, headingLevel = 2, className, children, ...props }: FormHeaderProps) {
  const Heading = `h${headingLevel}` as const;
  return <header {...props} className={classes(styles.header, className)}>
    <Heading className={styles.title}>{title}</Heading>
    {description && <p className={styles.description}>{description}</p>}
    {children}
    <div className={styles.divider} />
  </header>;
}
export type FormFooterProps = ComponentPropsWithRef<'div'>;
export function FormFooter({ children, className, ...props }: FormFooterProps) {
  return <div {...props} className={classes(styles.footer, className)}>
    <div className={styles.divider} /><div>{children}</div>
  </div>;
}
export type FormActionsProps = ComponentPropsWithRef<'div'> & {
  alignment?: 'right' | 'left' | 'space-between' | 'full-width';
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
};
/** Supply action props to compose Buttons, or children for application-specific actions. */
export function FormActions({ alignment = 'right', primaryAction, secondaryAction, children, className, ...props }: FormActionsProps) {
  const primary = primaryAction && <Button size="medium" type="submit" {...primaryAction} />;
  const secondary = secondaryAction && <Button size="medium" variant={alignment === 'space-between' || alignment === 'full-width' ? 'ghost' : 'secondary'} {...secondaryAction} />;
  return <div {...props} className={classes(styles.actions, className)} data-alignment={alignment}>
    {children ?? (alignment === 'full-width' ? <>{primary}{secondary}</> : <>{secondary}{primary}</>)}
  </div>;
}
