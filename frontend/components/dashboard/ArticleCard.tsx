import React from 'react';

interface ArticleCardProps {
  article: {
    title: string;
    snippet: string;
    image: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <a href="#" className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-48">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
            <p className="text-sm font-semibold text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">Read More &rarr;</p>
        </div>
    </a>
  );
};

export default ArticleCard;
