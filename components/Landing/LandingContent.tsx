'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import illustration from '../../assets/landing-illustration.svg';
import Image from 'next/image';

const LandingContent = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Ref for the parent container
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Trigger animation only once when visible

  return (
    <div
      ref={ref}
      className="bg-black px-10 pb-20 w-full flex items-center"
    >
      {/* Text Section with fade-in */}
      <motion.div
        className="w-1/2"
        variants={fadeIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <h2 className="text-left text-4xl text-white font-extrabold mb-10">
          Faça suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">análises exploratórias</span> e gere <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">gráficos</span> para seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">dashboards</span> sem codar nenhuma linha!
        </h2>
      </motion.div>

      {/* Image Section with fade-in */}
      <motion.div
        className="w-1/2 flex justify-center"
        variants={fadeIn}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <Image src={illustration} alt="illustration" width={500} height={500} />
      </motion.div>
    </div>
  );
};

export default LandingContent;
