import { GetServerSideProps } from "next";

type Props = {
  content: string;
};

export default function PastePage({ content }: Props) {
  return (
    <main style={{ padding: "20px", fontFamily: "monospace" }}>
      <pre>{content}</pre>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const id = params?.id as string;

  const baseUrl = `http://${req.headers.host}`;

  const res = await fetch(
    `${baseUrl}/api/pastes/${id}?html=1`
  );

  if (!res.ok) {
    return { notFound: true };
  }

  const data = await res.json();

  return {
    props: {
      content: data.content,
    },
  };
};
