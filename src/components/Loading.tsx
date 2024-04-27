import { Helmet } from 'react-helmet';

export default function Loading() {
  return (
    <>
      <Helmet>
        <title>Loading - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="loading">
        <img alt={import.meta.env.VITE_APP_NAME[0]} src="/icon.png" />
      </div>
    </>
  );
}
