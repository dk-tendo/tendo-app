import classNames from 'classnames';

interface TwoColumnContainerProps {
  className?: string;
  sidebarContainerClassName?: string;
  contentContainerClassName?: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const TwoColumnContainer = ({
  className = 'max-w-screen-2xl mx-auto h-full min-h-screen',
  sidebarContainerClassName,
  contentContainerClassName,
  sidebar,
  children,
}: TwoColumnContainerProps) => {
  return (
    <div className={classNames('grid grid-cols-1 md:grid-cols-12', className)}>
      <div
        className={classNames(
          'col-span-1 md:col-span-3 m-6 rounded-lg shadow-lg',
          sidebarContainerClassName
        )}
      >
        {sidebar}
      </div>
      <div
        className={classNames(
          'col-span-1 md:col-span-9 m-6 rounded-lg shadow-lg',
          contentContainerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
