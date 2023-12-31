"use client";

import { FaGithub } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";
import { projectsList } from "../data";
import { usePathname, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Section from "@/_components/section";
import styles from "@styles/projects.module.scss";

export default function Project() {
  const path = usePathname();
  const projectIndex = projectsList.findIndex(
    (project) => project.href === path
  );
  const project = projectsList[projectIndex];

  if (!project) {
    return notFound();
  }

  let next, prev;
  const length = projectsList.length;

  if (projectIndex !== length - 1) {
    next = projectsList[projectIndex + 1].href;
  } else {
    next = projectsList[0].href;
  }

  if (projectIndex !== 0) {
    prev = projectsList[projectIndex - 1].href;
  } else {
    prev = projectsList[length - 1].href;
  }

  const {
    title,
    techStack,
    longDescription,
    githubLink,
    liveLink,
    largePhoto,
  } = project;

  return (
    <Section title={title} next={next} prev={prev}>
      <div className={styles.project}>
        <Image alt="project image" src={largePhoto} width={400} height={400} priority={true}/>
        <div>
          {longDescription.map((paragraph) => (
            <p key={`${Math.random()}`}>{paragraph}</p>
          ))}
          <div className={styles.extLinks}>
            {githubLink && (
              <Link href={githubLink} target="_blank">
                GitHub <FaGithub />
              </Link>
            )}
            {liveLink && (
              <Link href={liveLink} target="_blank">
                Live Version <RxOpenInNewWindow />
              </Link>
            )}
          </div>
          <div className={styles.techStack} aria-label="tech stack">
            {techStack?.map((str, index) => {
              return <span key={str + index}>{str}</span>;
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
