import SidebarItem from "./sidebarItem";

export default function MobileMenu({ isHidden }: any) {
    return (
        <div
            className={`bg-[#121212] hidden mobile:block tablet:block 
      fixed bottom-0 left-0 right-0 w-full pt-2 pb-1 z-20 ${
          isHidden ? "invisible" : "visible"
      }`}
        >
            <div className="flex flex-row justify-center ">
                <SidebarItem name="home" label="Home" />
                <SidebarItem name="search" label="Search" />
                <SidebarItem name="library" label="Library" />
            </div>
        </div>
    );
}
