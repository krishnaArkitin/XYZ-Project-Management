import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
};

const smallIconProps = {
    ...iconProps,
    className: "w-5 h-5",
}

export const HomeIcon = () => (
  <svg {...iconProps} >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12v10.5a.75.75 0 00.75.75H21a.75.75 0 00.75-.75V12M10.5 18.75v-3.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v3.75" />
  </svg>
);

export const ListIcon = () => (
    <svg {...iconProps} >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const MessageIcon = () => (
  <svg {...iconProps} >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

export const VideoIcon = () => (
  <svg {...iconProps} >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
  </svg>
);

export const PlusCircleIcon = () => (
    <svg {...iconProps} >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const LogoutIcon = () => (
  <svg {...smallIconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const BellIcon = () => (
  <svg {...iconProps}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

// export const SearchIcon = ({className = "w-5 h-5"}) => (
//     <svg {...iconProps} className={className}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//     </svg>
// );

export const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    {...iconProps}
    className={className}
    style={{ width: "20px", height: "20px" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);


export const SettingsIcon = () => (
    <svg {...smallIconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.002 1.11-1.226M10.343 3.94a2.25 2.25 0 012.121 0c.55.224 1.02.684 1.11 1.226M10.343 3.94L9 6.25m2.121-2.31l1.343 2.31m0 0a2.25 2.25 0 002.121 0c.55-.224 1.02-.684 1.11-1.226m-2.121 2.31l1.343-2.31m0 0L21 6.25m-2.121-2.31c.55.224 1.02.684 1.11 1.226m-2.121 2.31L18 6.25m-3.879 5.75c.09.542.56 1.002 1.11 1.226m-2.121-2.31a2.25 2.25 0 012.121 0c.55.224 1.02.684 1.11 1.226m-2.121 2.31L15 14m2.121-2.31l-1.343 2.31m0 0L15 14m-2.121 2.31c-.55.224-1.02.684-1.11 1.226m2.121-2.31L12 11.75m-3.879 5.75c-.09-.542-.56-1.002-1.11-1.226m2.121 2.31a2.25 2.25 0 00-2.121 0c-.55-.224-1.02-.684-1.11-1.226m2.121-2.31L9 14m-2.121 2.31l1.343-2.31m0 0L6 14m2.121-2.31c.55-.224 1.02-.684 1.11-1.226M9 6.25L6 9.375m3-3.125L12 3.375m0 0a2.25 2.25 0 00-2.121 0L9 6.25m3-3.125L15 6.25m0 0l3 3.125M3 9.375L6 6.25m0 0L9 3.375m0 0a2.25 2.25 0 012.121 0L12 6.25m3 3.125L12 11.75m0 0L9 9.375m3 3.125L15 15m0 0l3 3.125M9 14.625L6 17.75m3-3.125L12 18.125m0 0a2.25 2.25 0 002.121 0L15 15m3 3.125L15 15m0 0l-3-3.125m-6 6.25L9 14.625" />
    </svg>
);
