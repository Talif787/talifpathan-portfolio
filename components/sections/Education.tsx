import { degrees } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Disclosure } from "@/components/motion/Disclosure";
import { RecognitionBlock } from "./Recognition";

/**
 * Coursework is tabular data, so it uses a real table with a header row. On
 * narrow screens the header is hidden from sight but kept for screen readers
 * and each row restacks, rather than forcing a horizontal scroll.
 *
 * Grades and GPA come from the official transcript, not from a resume.
 */
export function Education() {
  return (
    <Section
      id="education"
      label="Education"
      title="Two degrees, the coursework behind them, and the credentials on top"
    >
      <div className="flex flex-col gap-2xl">
        {degrees.map((degree) => (
          <section
            key={degree.id}
            aria-label={`${degree.credential}, ${degree.institution}`}
          >
            <header className="flex flex-col gap-2xs border-b border-line pb-m md:flex-row md:items-baseline md:justify-between">
              <div>
                <h3 className="text-xl">
                  {degree.credential}, {degree.field}
                </h3>
                <p className="mt-2xs text-xs text-muted">
                  {degree.institution}
                  {degree.school ? `, ${degree.school}` : ""}
                </p>
              </div>
              <div className="shrink-0 md:text-end">
                <p className="mono text-2xs text-faint">{degree.period}</p>
                <p className="mono mt-2xs text-2xs text-faint">{degree.location}</p>
              </div>
            </header>

            {degree.gpa ? (
              <p className="mt-m text-base text-muted">
                <span className="text-ink">GPA {degree.gpa}</span>
                {degree.gpaNote ? `, ${degree.gpaNote}` : ""}
              </p>
            ) : null}

            {degree.highlights?.length ? (
              <ul className="measure mt-m space-y-s">
                {degree.highlights.map((item) => (
                  <li
                    key={item}
                    className="relative ps-l text-base text-muted before:absolute before:start-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent-line"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {degree.courses?.length ? (
              <Disclosure
                className="mt-l"
                openLabel={`Coursework, ${degree.courses.length} courses`}
                closeLabel="Hide coursework"
              >
                <table className="courses">
                  <caption className="sr-only">
                    Graduate coursework with terms and grades
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Code</th>
                      <th scope="col">Course</th>
                      <th scope="col">Term</th>
                      <th scope="col" className="text-end">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {degree.courses.map((course) => (
                      <tr key={course.code}>
                        <td className="course-code">{course.code}</td>
                        <td className="course-title">{course.title}</td>
                        <td className="course-term">{course.term}</td>
                        <td className="course-grade">
                          {course.grade ?? "in progress"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Disclosure>
            ) : null}
          </section>
        ))}

        <RecognitionBlock />
      </div>
    </Section>
  );
}
