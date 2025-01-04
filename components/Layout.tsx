import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen  bg-black-900">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 bg-gray-800 text-white p-4 overflow-auto">
        {children} 
      </div>
    </div>
  );
};

export default Layout;
