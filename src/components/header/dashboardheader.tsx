import React from "react";

export default function DashboardHeader() {
    return (
        <header id="header" className="bg-primary px-8 py-6">
            <div className="flex items-center justify-between">
                {/* Left: Logo & Title */}
                <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <span className="text-white text-2xl">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="compass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={28} height={28}>
                                <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path>
                            </svg>
                        </span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">PudheKai</h1>
                        <p className="text-white/80 text-sm">AI Career Guidance Platform</p>
                    </div>
                </div>
                {/* Right: Actions */}
                <div className="flex items-center space-x-4">
                    <button className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-colors">
                        <span className="text-lg">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={22} height={22}>
                                <path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"></path>
                            </svg>
                        </span>
                    </button>
                    <img
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white/50"
                    />
                </div>
            </div>
        </header>
    );
}