import Image from 'next/image';
import { motion } from 'framer-motion';

interface SideModuleRightProps {
  title: string;
  description: string;
  moduleImageSrc: string;
  backgroundImageSrc: string;
  additionalImageSrc?: string; // Optional parameter
}

const fadeInFromRightVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2 } },
};

const SideModuleRight: React.FC<SideModuleRightProps> = ({ title, description, moduleImageSrc, backgroundImageSrc, additionalImageSrc }) => {
  return (
    <motion.div
      className="relative w-full overflow-hidden shadow-lg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInFromRightVariants}
    >
      <div className="absolute inset-0 z-0">
        <Image src={backgroundImageSrc} alt="" fill style={{objectFit:"cover"}} />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/40"></div>
      </div>
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-16 md:py-20 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
        {additionalImageSrc && (
          <div className="flex-shrink-0 flex justify-center items-center">
            <Image src={additionalImageSrc} width={380} height={380} alt={`Vista previa ${title}`} className="rounded-lg drop-shadow-2xl" />
          </div>
        )}
        <div className="flex flex-col items-start flex-1 max-w-3xl">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <Image src={moduleImageSrc} alt="" width={56} height={56} />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">{title}</h3>
          </div>
          <div className="h-1 w-16 bg-clear rounded-full mb-5"></div>
          <p className="text-base md:text-lg text-white/90 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SideModuleRight;
