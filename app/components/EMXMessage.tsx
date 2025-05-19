// import { parseEMXTags } from '../../utils/parseEMXTags';
import {
  Sparkles,
  Wind,
  BookOpen,
  Download,
  Zap,
} from 'lucide-react';

const tagStyles: Record<string, string> = {
  shift: 'text-purple-500 italic animate-fade-in-slow',
  breath: 'text-green-500 tracking-wide text-lg animate-pulse',
  journal: 'text-blue-600 font-serif bg-blue-50 px-3 py-2 rounded-md shadow-sm',
  install: 'text-pink-600 underline underline-offset-4 font-medium animate-glow',
  disrupt: 'text-red-600 font-extrabold uppercase animate-wiggle text-sm tracking-widest',
};

const tagIcons: Record<string, JSX.Element> = {
  shift: <Sparkles className="inline w-5 h-5 mr-2 text-purple-400" />,
  breath: <Wind className="inline w-5 h-5 mr-2 text-green-400" />,
  journal: <BookOpen className="inline w-5 h-5 mr-2 text-blue-400" />,
  install: <Download className="inline w-5 h-5 mr-2 text-pink-400" />,
  disrupt: <Zap className="inline w-5 h-5 mr-2 text-red-400 animate-wiggle" />,
};

 export default function EMXMessage({ message }: { message: string }) {
  const parsed = parseEMXTags(message);

  // If nothing parsed, show the raw message
  if (!parsed || parsed.length === 0) {
    return (
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
        {message}
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-2">
      {parsed.map((block, index) => (
        <p key={index} className={tagStyles[block.type] || 'text-gray-800 dark:text-gray-200'}>
          {tagIcons[block.type]}{block.content}
        </p>
      ))}
    </div>
  );
}
