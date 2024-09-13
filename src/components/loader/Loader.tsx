import {LoaderOverlay, LoaderSpinner} from "./style"

export const Loader: React.FC = () => {
  return (
    <LoaderOverlay>
      <LoaderSpinner />
    </LoaderOverlay>
  );
};