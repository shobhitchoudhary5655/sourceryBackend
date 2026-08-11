import Holiday from '../models/Holiday';

class HolidayDao {

  public async create(
    data: {
      holidayName: string;
      date: string;
      holidayType: "PUBLIC",
    }
  ) {
    return Holiday.create(data);
  }

  public async findAll() {
    return Holiday.findAll();
  }

  public async findByDate(
    date: string
  ) {
    return Holiday.findOne({
      where: { date },
    });
  }
}

export default new HolidayDao();