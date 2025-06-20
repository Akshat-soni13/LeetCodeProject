import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap,Video } from 'lucide-react';
import { NavLink } from 'react-router';
import CosmicBackground from './CosmicBackground';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/video'
    } 
  ];

  return (
    <CosmicBackground>
    <div className="h-screen overflow-y-auto  ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 ">
          <h1 className="text-4xl font-bold  mb-4 text-white">
            Admin Panel
          </h1>
          <p className=" text-lg text-white">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-white">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (   
              <div
                key={option.id}
                className="card border-2 border-blue shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="card-body items-center text-center p-8  ">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <IconComponent size={32}  />
                  </div>
                  
                  {/* Title */}
                  <h2 className="card-title text-xl mb-2">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className=" mb-6">
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="card-actions">
                    <div className="card-actions">
                    <NavLink 
                    to={option.route}
                   className={`btn ${option.color} btn-wide`}
                   >
                   {option.title}
                   </NavLink>
                   </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </CosmicBackground>
  );
}

export default Admin;