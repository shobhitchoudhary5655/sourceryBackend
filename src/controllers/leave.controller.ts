import { Request, Response } from 'express';
import leaveService from '../services/leave.service';

class LeaveController {

  public applyLeave = async (req: any, res: Response) => {
    try {
      const result = await leaveService.applyRequest(req.user.id, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  public getMyLeaves = async (req: any, res: Response) => {
    try {
      const result = await leaveService.getMyLeaves(req.user.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // public getAllLeaveRequest = async (req: Request, res: Response) => {
  //   try {
  //     const result = await leaveService.getAllLeaveRequests(req.query);
  //     return res.status(200).json(result);
  //     // } catch (error: any) {
  //     //   return res.status(500).json({
  //     //     success: false,
  //     //     message: error.message,
  //     //   });
  //     // }
  //   } catch (error: any) {
  //     console.log("🔥 FULL ERROR:", error.response?.data);
  //     console.log("🔥 STATUS:", error.response?.status);
  //     console.log("🔥 MESSAGE:", error.message);

  //     throw error.response?.data || {
  //       message: 'Failed To Get Employees',
  //     };
  //   }
  // };
  public getAllLeaveRequest = async (req: Request, res: Response) => {
    try {
      const result = await leaveService.getAllLeaveRequests(req.query);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('GET LEAVE REQUEST ERROR:', error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  };

  public updateLeaveStatus = async (req: Request, res: Response) => {
    try {
      const result = await leaveService.updateLeaveStatus(Number(req.params.id), req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

}

export default new LeaveController();


// const { Leave, User, Attendance, } = require('../models')
// const WeeklyOff = require('../models/WeeklyOff');
// const { formatDate } = require('../utils/dateHelper');
// const Holiday = require('../models/Holiday');

// const applyLeave = async (req, res) => {
//     try {
//         const id = req.user.id
//         const { leaveType, startDate, endDate, reason } = req.body;
//         const leave = await Leave.create({
//             userId: id,
//             leaveType,
//             startDate,
//             endDate,
//             reason
//         })
//         res.status(201).json({ success: true, message: 'Leave request submitted successfully', leave })
//     } catch (error) {
//         console.log(error, 'error')
//         res.status(500).json({ success: false, message: 'Failed to submit leave request', })
//     }
// }

// const getMyLeaves = async (req, res) => {
//     try {
//         const id = req.user.id
//         const leaves = await Leave.findAll({
//             where: {
//                 userId: id
//             },
//             order: [['createdAt', 'DESC']]
//         })
//         res.status(200).json({ success: true, leaves })
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to fetch leaves' })
//     }
// }

// // const getAllLeaveRequest = async (req, res) => {
// //     try {
// //         const leaves = await Leave.findAll({
// //             include: [{
// //                 model: User,
// //                 attributes: [
// //                     'id',
// //                     'name',
// //                     'email',
// //                 ],
// //             }],
// //             order: [['createdAt', 'DESC'],]
// //         })
// //         console.log('leaves', leaves)
// //         res.status(200).json({ success: true, requests: leaves, })
// //     } catch (eror) {
// //         res.status(500).json({ success: true, message: 'Failed to fetch requests' })
// //     }
// // }
// const { Op } = require('sequelize');

// const getAllLeaveRequest = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = '',
//       status = '',
//     } = req.query;

//     const offset =
//       (page - 1) * limit;

//     const where = {};

//     if (
//       status &&
//       status !== 'all'
//     ) {
//       where.status = status;
//     }

//     const { count, rows } =
//       await Leave.findAndCountAll({
//         where,
//         include: [
//           {
//             model: User,
//             attributes: [
//               'id',
//               'name',
//               'email',
//             ],
//             where: search
//               ? {
//                   name: {
//                     [Op.like]:
//                       `%${search}%`,
//                   },
//                 }
//               : undefined,
//           },
//         ],
//         order: [
//           ['createdAt', 'DESC'],
//         ],
//         limit:
//           Number(limit),
//         offset:
//           Number(offset),
//       });

//     res.status(200).json({
//       success: true,
//       requests: rows,
//       total: count,
//       totalPages:
//         Math.ceil(
//           count / limit
//         ),
//       currentPage:
//         Number(page),
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message:
//         error.message,
//     });
//   }
// };

// const acceptLeave = async (req, res) => {
//     try {
//         const { id } = req.params
//         console.log(id, 'id')
//         const leave = await Leave.findByPk(id)
//         console.log(leave, 'leave')
//         if (!leave) {
//             return res.status(404).json({ success: false, message: 'Leave not found' })
//         }
//         leave.status = 'approved'
//         await leave.save()
//         return res.status(200).json({ success: true, message: 'Leave approved successfully' })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Failed to approve leave' })
//     }
// }

// const rejectLeave = async (req, res) => {
//     try {
//         const { id } = req.params
//         console.log(id, 'id')
//         const leave = await Leave.findByPk(id)
//         console.log(leave, 'leave')
//         if (!leave) {
//             return res.status(404).json({ success: false, message: 'Leave not found' })
//         }
//         leave.status = 'rejected'
//         await leave.save()
//         return res.status(200).json({ success: true, message: 'Leave rejected successfully' })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Failed to reject leave' })
//     }
// }

// const updateLeaveStatus = async (
//     req,
//     res
// ) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         if (
//             !['approved', 'rejected'].includes(
//                 status
//             )
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid status',
//             });
//         }

//         const leave = await Leave.findByPk(id);

//         if (!leave) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Leave not found',
//             });
//         }

//         if (leave.status === 'approved') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Leave already approved',
//             });
//         }

//         leave.status = status;

//         await leave.save();

//         if (status === 'approved') {

//             let currentDate =
//                 new Date(leave.startDate);

//             const endDate =
//                 new Date(leave.endDate);

//             const weeklyOffs = await WeeklyOff.findAll();

//             const weeklyOffDays =
//                 weeklyOffs.map(
//                     item => item.dayName
//                 );

//             while (currentDate <= endDate) {

//                 const dayName =
//                     currentDate.toLocaleDateString(
//                         'en-US',
//                         {
//                             weekday: 'long',
//                             timeZone: 'Asia/Kolkata',
//                         }
//                     );

//                 // Skip Weekly Off
//                 if (
//                     weeklyOffDays.includes(dayName)
//                 ) {
//                     currentDate.setDate(
//                         currentDate.getDate() + 1
//                     );
//                     continue;
//                 }

//                 const formattedDate =
//                     formatDate(currentDate);

//                 const holiday =
//                     await Holiday.findOne({
//                         where: {
//                             date: formattedDate,
//                         },
//                     });

//                 // Skip Holiday
//                 if (holiday) {
//                     currentDate.setDate(
//                         currentDate.getDate() + 1
//                     );
//                     continue;
//                 }

//                 const attendance =
//                     await Attendance.findOne({
//                         where: {
//                             userId: leave.userId,
//                             date: formattedDate,
//                         },
//                     });

//                 if (attendance && attendance.status === 'present') {
//                     currentDate.setDate(
//                         currentDate.getDate() + 1
//                     );
//                     continue;
//                 }

//                 if (!attendance) {

//                     await Attendance.create({
//                         userId: leave.userId,
//                         date: formattedDate,
//                         status: 'leave',
//                     });

//                 } else {

//                     attendance.status = 'leave';

//                     await attendance.save();
//                 }

//                 currentDate.setDate(
//                     currentDate.getDate() + 1
//                 );
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             message: `Leave ${status} successfully`,
//             leave,
//         });

//     } catch (error) {

//         console.log(error);

//         return res.status(500).json({
//             success: false,
//             message:
//                 'Failed to update leave status',
//         });
//     }
// };

// module.exports = { applyLeave, getMyLeaves, getAllLeaveRequest, acceptLeave, rejectLeave, updateLeaveStatus }