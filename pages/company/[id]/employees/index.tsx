import { companyGraphQL } from "../../../../graphql/queries/company";
import { useQuery } from "@apollo/react-hooks";
import * as _ from "lodash";

import { useFetchUser } from "../../../../utils/user";
import { Loading } from "../../../../components/notify/Loading";
import { Error } from "../../../../components/notify/Error";
import { LandingLayout } from "../../../../components/layout/LandingLayout";
import isValidUser from "../../../../utils/isValidUser";
import Router from "next/router";
import { MainLayout } from "../../../../components/layout/MainLayout";
import { EmployeeList } from "../../../../components/EmployeesList";

const Employees = ({ id }) => {
  const { user, loading: isFetchUser } = useFetchUser();

  const { loading: isQueryLoading, data, error: isCompanyError } = useQuery(
    companyGraphQL,
    {
      variables: { where: { id } },
    }
  );

  if (!data || isQueryLoading || isFetchUser) return <Loading />;

  if (!user) {
    Router.push("/");
  } else if (!isValidUser(user, data)) {
    return (
      <LandingLayout title="No Company Access">
        <Error errorText="The current user does not have permission to view this company" />
      </LandingLayout>
    );
  }

  const { company } = data;
  return (
    <MainLayout
      title={`${company.legalBusinessName} - Employees`}
      companyId={id}
      defaultSelectedKeys="8"
    >
      <EmployeeList id={id} legalBusinessName={company.legalBusinessName} branches={company.companyBranches} />
    </MainLayout>
  );
};

Employees.getInitialProps = ({ query }) => {
  const { id } = query;
  return { id };
};

export default Employees;
