import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { getHostnameDataBySubdomain, getSubdomainPaths } from "@/lib/db";

// Our types for the site data
export interface Props {
  name: String
  description: String
  subdomain: String
  customDomain: String
}

type StaticPropsParams = {
  site: string;
}

export default function Index(props: Props) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <>
        <p>
          Loading...
        </p>
      </>
    )
  }

  return (
    <>
      <h1>
        {props.name}
      </h1>
    </>
  )
}

// Getting the paths for all the subdomains in our database
export async function getStaticPaths() {
  const paths = await getSubdomainPaths()

  return {
    paths,
    fallback: true
  }
}

// Getting data to display on each custom subdomain
export async function getStaticProps(context: GetStaticPropsContext) {
  const { site } = context.params as StaticPropsParams;

  const sites = await getHostnameDataBySubdomain(site);

  return {
    props: sites,
    revalidate: 3600
  }
}