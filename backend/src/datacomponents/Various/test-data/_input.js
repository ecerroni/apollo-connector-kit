export default `
input inputConstraint {
  minStringLengthIs3: String! @constraint(minLength: 3)
}
`;
