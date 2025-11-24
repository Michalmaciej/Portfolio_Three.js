import {
  tft,
  rubik,
  book,
  chess,
  streamlit,
  numpy,
  python,
  tensorflow,
  reactjs,
  mlflow,
  pandas,
  flask,
  keras,
  git,
  kubernetes,
  docker,
  prz,
  threejs,
  sign,
  portfolio,
  mathematic,
  crypto,
  brain,
  attack,
  prestige,
  orzelek,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "school",
    title: "Education",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const interests = [
  {
    title: "Chess",
    icon: chess,
  },
  {
    title: "Teamfight Tactics",
    icon: tft,
  },
  {
    title: "Rubik's cube",
    icon: rubik,
  },
  {
    title: "Literature",
    icon: book,
  },
];

const technologies = [
  {
    name: "Python",
    icon: python,
  },
  {
    name: "Tensorflow",
    icon: tensorflow,
  },
  {
    name: "Streamlit",
    icon: streamlit,
  },
  {
    name: "NumPy",
    icon: numpy,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "MLFlow",
    icon: mlflow,
  },
  {
    name: "Pandas",
    icon: pandas,
  },
  {
    name: "Flask",
    icon: flask,
  },
  {
    name: "Keras",
    icon: keras,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Kubernetes",
    icon: kubernetes,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const educations = [
  {
    title: "Politechnika Rzeszowska studia inżynierskie",
    school_name: "Politechnika Rzeszowska im. Ignacego Łukasiewicza",
    icon: prz,
    iconBg: "#ffffffff",
    date: "October 2020 - February 2024",
    points: [
      "Degree: Bachelor of Science (B.Sc.).",
      "Field of Study: Computer Science (Informatyka).",
      "Specialization: Information Systems Engineering.",
      "Key Skill Acquired: Proficiency in software development methodologies, database architecture, network design, and principles of secure and scalable enterprise systems.",
      "Bachelor's Project Thesis: Calculation of Measurement Uncertainties using Python and Tkinter.",
    ],
  },
  {
    title: "Politechnika Rzeszowska studia magisterskie",
    school_name: "Politechnika Rzeszowska im. Ignacego Łukasiewicza",
    icon: prz,
    iconBg: "#ffffffff",
    date: "February 2024 - September 2025",
    points: [
      "Degree: Master of Science (M.Sc.).",
      "Field of Study: Computer Science (Informatyka).",
      "Specialization: Cybersecurity and Cloud Technologies.",
      "Key Skill Acquired: Advanced study in securing modern digital infrastructure, focusing on network security, threat analysis, data privacy, and the implementation and management of scalable services in cloud environments (e.g., AWS, Azure).",
      "Master's Project Thesis: Sign Language Recognition with Facial Expression Analysis.",
    ],
  },
  ];

  const workplaces = [
  {
    title: "Prestige Electro",
    workplace_name: "Prestige Electro - Serwis i sprzedaż komputerów, laptopów.",
    icon: prestige,
    iconBg: "#ffffffff",
    date: "July 2022 - August 2022",
    points: [
      "Work as part of an unpaid student internship.",
      "Service and sale of computers and laptops.",
      "Replacement of damaged electronic components.",
      "Customer service and sales.",
      "Designing and building computer sets.",
    ],
  },
  {
    title: "Orzełek",
    workplace_name: "Orzełek Sp. z o.o.",
    icon: orzelek,
    iconBg: "#ffffffff",
    date: "April 2025 - October 2025",
    points: [
      "Wholesaler of food and everyday products.",
      "Accepting deliveries of products.",
      "Distributing, adding and stacking goods.",
      "Completing orders for smaller partner stores.",
      "Packing intercontinental deliveries into a container.",
    ],
  },
  ];
  

const projects = [
  {
    name: "Sign Language Recognition",
    description:
      "The project involved designing and implementing a model that recognizes American Sign Language expressions while taking into account facial expressions. The TensorFlow library was used for this purpose. The size of the feature vector extracted from MediaPipe was reduced using a cascade of autoencoders, and the model was based on the LSTM network.",
    tags: [
      {
        name: "tensorflow",
        color: "blue-text-gradient",
      },
      {
        name: "numpy",
        color: "green-text-gradient",
      },
      {
        name: "pandas",
        color: "pink-text-gradient",
      },
    ],
    image: sign,
    source_code_link: "https://github.com/Michalmaciej/Sign-language-recognition",
  },
  {
    name: "Portfolio Website",
    description:
      "The project involved creating a portfolio website using technologies such as React, Three.js and TailwindCSS. The website describes me, my education, employment history, projects, skills and allows you to contact me via email. The project utilized 3D models created in Blender, such as the Laptop Model, Star Model, and Planet Model.\n Credit: JavaScript Mastery.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwindcss",
        color: "green-text-gradient",
      },
      {
        name: "three.js",
        color: "pink-text-gradient",
      },
    ],
    image: portfolio,
    source_code_link: "https://github.com/Michalmaciej/Portfolio_Three.js",
  },
  {
    name: "Math Equation Solver",
    description:
      "The project involved creating a system that utilizes Streamlit to offer users a web service where they can draw a mathematical equation with the mouse and receive its solution. A Transformr model trained on the CROHME dataset is used to recognize the drawn equations and transform them to the LaTeX standard. The equations are then solved using SumPy.",
    tags: [
      {
        name: "tensorflow",
        color: "blue-text-gradient",
      },
      {
        name: "streamlit",
        color: "green-text-gradient",
      },
      {
        name: "sympy",
        color: "pink-text-gradient",
      },
    ],
    image: mathematic,
    source_code_link: "https://github.com/Michalmaciej/Math-Equation-Solver",
  },
  {
    name: "CT Brain Scan Segmentation",
    description:
      "In progress.",
    tags: [
      {
        name: "pytorch",
        color: "blue-text-gradient",
      },
      {
        name: "monai",
        color: "green-text-gradient",
      },
      {
        name: "flask",
        color: "pink-text-gradient",
      },
    ],
    image: brain,
    source_code_link: "https://github.com/Michalmaciej/CT-Brain-Scan-Segmentation",
  },
  {
    name: "Crypto Currency Trading Bot",
    description:
      "In progress.",
    tags: [
      {
        name: "tensorflow",
        color: "blue-text-gradient",
      },
      {
        name: "django",
        color: "green-text-gradient",
      },
      {
        name: "react",
        color: "pink-text-gradient",
      },
    ],
    image: crypto,
    source_code_link: "https://github.com/Michalmaciej/Crypto-currency-trading-bot",
  },
  {
    name: "Network Attacks Detection",
    description:
      "The project focused on testing how generative language models could detect network anomalies. A solution developed by ChatGPT was developed and its accuracy and precision compared to other popular classification approaches (logistic regression, decision tree, naive bayes, k-neighbors). The attack detection functionality of methods such as autoencoder, GANs, VAEs, and OpenAI API was also tested.",
    tags: [
      {
        name: "scikit-learn",
        color: "blue-text-gradient",
      },
      {
        name: "keras",
        color: "green-text-gradient",
      },
      {
        name: "tensorflow",
        color: "pink-text-gradient",
      },
    ],
    image: attack,
    source_code_link: "https://github.com/Michalmaciej/ML-models-in-attacts-detection",
  },
];

export { interests, technologies, educations, projects, workplaces };