export const TwoColumnContainer = ({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="grid grid-cols-12 h-full min-h-screen">
      <div className="col-span-3 bg-red-200 m-6 rounded-lg shadow-md">
        {sidebar}
      </div>
      <div className="col-span-9 bg-green-50 m-6 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};
