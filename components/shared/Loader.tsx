import { ClipLoader } from 'react-spinners';

export default function Loader({ size = 32, color = '#4F46E5', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} data-testid="loader">
      <ClipLoader size={size} color={color} />
    </div>
  );
} 