export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap justify-center pt-4 px-4">{children}</div>
  );
};
