import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { workplaces } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const WorkplaceCard = ({ workplace }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1a1925",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={workplace.date}
      iconStyle={{ background: workplace.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={workplace.icon}
            alt={workplace.workplace_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{workplace.title}</h3>
        <p
          className='text-[#62607c] text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {workplace.workplace_name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {workplace.points.map((point, index) => (
          <li
            key={`workplace-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Work = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          Where I have worked so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Employment history.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {workplaces.map((workplace, index) => (
            <WorkplaceCard
              key={`workplace-${index}`}
              workplace={workplace}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Work, "work");