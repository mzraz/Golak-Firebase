import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence} from 'framer-motion';
import React from 'react';

const AnimateRoute = ({ children }) => {
    const location = useLocation();
  
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  };
  

  export default AnimateRoute
  