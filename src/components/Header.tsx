import React from 'react';
import { MapPin } from 'lucide-react';

interface Props { total: number; visited: number; }

const Header: React.FC<Props> = ({ total, visited }) => (
  <header className="bg-gradient-hero text-white shadow-warm">
    <div className="container mx-auto px-4 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 animate-float" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">SpotSaver</h1>
          <p className="text-white/80 text-sm">Discover & save amazing places</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center"><div className="font-bold text-lg">{total}</div><div className="text-white/80">Spots</div></div>
        <div className="text-center"><div className="font-bold text-lg">{visited}</div><div className="text-white/80">Visited</div></div>
      </div>
    </div>
  </header>
);

export default Header;
