import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from './Skeleton';

interface CardSkeletonProps {
  variant?: 'job' | 'company' | 'profile' | 'article';
  className?: string;
  showImage?: boolean;
  showActions?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = 'job',
  className = '',
  showImage = true,
  showActions = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const renderJobSkeleton = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        {showImage && (
          <motion.div variants={itemVariants}>
            <Skeleton variant="rounded" width={48} height={48} />
          </motion.div>
        )}
        <div className="flex-1 space-y-3">
          <motion.div variants={itemVariants}>
            <Skeleton variant="text" width="75%" height="1.25rem" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Skeleton variant="text" width="50%" height="1rem" />
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="rounded" width={70} height={24} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Skeleton variant="text" lines={2} />
          </motion.div>
        </div>
      </div>
      {showActions && (
        <motion.div variants={itemVariants} className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <Skeleton variant="text" width={100} height="0.875rem" />
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCompanySkeleton = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-4">
        <Skeleton variant="circular" width={64} height={64} />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Skeleton variant="text" width="60%" height="1.25rem" className="mx-auto" />
        <Skeleton variant="text" width="40%" height="1rem" className="mx-auto" />
      </motion.div>
      <motion.div variants={itemVariants} className="mt-4">
        <Skeleton variant="text" lines={2} />
      </motion.div>
      {showActions && (
        <motion.div variants={itemVariants} className="mt-4">
          <Skeleton variant="rounded" width={120} height={36} className="mx-auto" />
        </motion.div>
      )}
    </motion.div>
  );

  const renderProfileSkeleton = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div variants={itemVariants}>
          <Skeleton variant="circular" width={56} height={56} />
        </motion.div>
        <div className="flex-1 space-y-2">
          <motion.div variants={itemVariants}>
            <Skeleton variant="text" width="70%" height="1.25rem" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Skeleton variant="text" width="50%" height="1rem" />
          </motion.div>
        </div>
      </div>
      <motion.div variants={itemVariants} className="space-y-3">
        <Skeleton variant="text" lines={3} />
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
        </div>
      </motion.div>
    </motion.div>
  );

  const renderArticleSkeleton = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {showImage && (
        <motion.div variants={itemVariants}>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </motion.div>
      )}
      <div className="p-6 space-y-4">
        <motion.div variants={itemVariants}>
          <Skeleton variant="text" width="90%" height="1.5rem" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Skeleton variant="text" lines={3} />
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1">
            <Skeleton variant="text" width="40%" height="0.875rem" />
          </div>
          <Skeleton variant="text" width="60%" height="0.875rem" />
        </motion.div>
      </div>
    </motion.div>
  );

  switch (variant) {
    case 'company':
      return renderCompanySkeleton();
    case 'profile':
      return renderProfileSkeleton();
    case 'article':
      return renderArticleSkeleton();
    default:
      return renderJobSkeleton();
  }
};

export default CardSkeleton;