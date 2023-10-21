import { format } from "date-fns";

type Props = {
  published: Date;
};
export default function Published(props: Props) {
  return <span>{format(props.published, "MMMM d, yyyy")}</span>;
}
