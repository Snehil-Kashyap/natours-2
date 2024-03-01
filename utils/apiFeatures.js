class APIFeatures {
  //BUILD QUERY
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortString);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  paging() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
