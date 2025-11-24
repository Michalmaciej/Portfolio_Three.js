import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { interests } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const InterestCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-[#1a1925] rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >I'm a dedicated and highly motivated software developer, holding a Master of Science (M.Sc.) degree in Computer Science. 
      While I am currently at the start of my professional journey, I bring a robust foundational knowledge and a drive for learning 
      that rapidly translates into effective coding. My core technical focus lies at the intersection of Machine Learning (ML) 
      and Web Application Development. I specialize in creating intelligent, data-driven solutions and building efficient, scalable web 
      interfaces. I am proficient in Python for data manipulation and modeling, with hands-on experience using frameworks like TensorFlow 
      and Keras to design and implement robust ML models. My work in this area involves the full pipeline: from data preprocessing and 
      feature engineering to model training and performance evaluation. On the development side, I utilize React to build modern, dynamic 
      user interfaces. I also possess experience with Three.js, focusing on the creation of engaging 3D visuals and web experiences.
      </motion.p>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}><br></br>What i enjoy doing</p>
        <h2 className={styles.sectionHeadText}>Interests.</h2>
      </motion.div>
      <motion.p
      variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >I thrive on tackling real-world problems and collaborating closely to deliver efficient, scalable, and user-friendly solutions. My ability to learn quickly ensures I can adapt to new challenges and technologies to meet specific client needs.
      Beyond the code, I maintain a keen interest in strategic and analytical pursuits, including playing chess and Teamfight Tactics (TFT). I also enjoy the challenge of solving the Rubik's Cube and engaging with classic and contemporary literature. These hobbies reflect my analytical mindset and dedication to problem-solving.
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {interests.map((interest, index) => (
          <InterestCard key={interest.title} index={index} {...interest} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");