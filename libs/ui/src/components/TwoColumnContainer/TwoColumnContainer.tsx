import classNames from 'classnames';

interface TwoColumnContainerProps {
  className?: string;
  sidebarContainerClassName?: string;
  contentContainerClassName?: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const TwoColumnContainer = ({
  className = 'h-full min-h-screen',
  sidebarContainerClassName,
  contentContainerClassName,
  sidebar,
  children,
}: TwoColumnContainerProps) => {
  return (
    <div className={classNames('grid grid-cols-12', className)}>
      <div
        className={classNames(
          'col-span-3 m-6 rounded-lg shadow-lg',
          sidebarContainerClassName
        )}
      >
        {sidebar}
      </div>
      <div
        className={classNames(
          'col-span-9 m-6 rounded-lg shadow-lg',
          contentContainerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
