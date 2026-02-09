"use client";

import api, { authApis, endpoints, handleApiError } from '@/src/utils/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface FormData {
  paymentMethod: 'MOMO';
}

interface CourseFeature {
  id: number;
  text: string;
}

interface CourseBenefit {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const BuyCourse = () => {
  const [formData, setFormData] = useState<FormData>({
    paymentMethod: 'MOMO',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const loadCourseData = async (courseId: string | undefined) => {
    try {
      if (!id) return
      setIsLoading(true);
      const res = await api.get(endpoints["coursesDetail"](id));
      console.log('Courses response:', res.data);
      setCourseTitle(res.data.name);
      setCoursePrice(res.data.price);
    } catch (e) {
      handleApiError(e, "Không thể tải thông tin khóa học.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourseData(id);
  }, [id]);

  const courseFeatures: CourseFeature[] = [
    { id: 1, text: "50 giờ học chất lượng cao" },
    { id: 2, text: "Dự án thực tế với mentor" },
    { id: 3, text: "Hỗ trợ 24/7 từ giảng viên" },
    { id: 4, text: "Cập nhật nội dung liên tục" },
    { id: 5, text: "Cộng đồng học viên đông đức" }
  ];

  const courseBenefits: CourseBenefit[] = [
    {
      id: 1,
      icon: "🎯",
      title: "Thực hành 100%",
      description: "Học qua dự án thực tế, không chỉ lý thuyết suông"
    },
    {
      id: 2,
      icon: "👨‍💻",
      title: "Mentor 1-1",
      description: "Được hướng dẫn trực tiếp từ senior developer"
    },
    {
      id: 3,
      icon: "📜",
      title: "Chứng chỉ",
      description: "Nhận chứng chỉ hoàn thành được công nhận"
    }
  ];

  const formatPrice = (price: string | number): string => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return num.toLocaleString("vi-VN") + " đ";
  };



  const registerCoure = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token')
      if (!token) return
      const res = await authApis(token).post(endpoints['enrollmentsCreate'], {
        course: id
      })
      const payUrl = res.data.payUrl
      if (payUrl) {
        window.location.href = payUrl;
      }
    } catch (e) {
      handleApiError(e, "Đăng ký khóa học không thành công.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Course Information */}
          <div className="space-y-6">
            <div className="border border-gray-300 p-8 rounded-lg h-fit">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
                {courseTitle.split(' ').map((word, index) => (
                  <React.Fragment key={index}>
                    {word}
                    {index === 1 && <br />}
                    {index !== 1 && index !== courseTitle.split(' ').length - 1 && ' '}
                  </React.Fragment>
                ))}
              </h1>

              <ul className="space-y-3 text-gray-700 mb-8">
                {courseFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start">
                    <span className="text-gray-500 mr-3 mt-1">-</span>
                    <span className="leading-relaxed">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="text-4xl font-bold text-gray-800">
                {formatPrice(coursePrice)}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Ưu đãi đặc biệt:</strong> Giảm 20% cho 100 học viên đầu tiên!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="space-y-6">
            <div className="border border-gray-300 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Đăng ký ngay
              </h2>

              <div className="space-y-4">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Phương thức thanh toán *
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      disabled={isLoading}
                      className={`flex-1 py-4 px-4 border-2 rounded-md font-semibold transition-all duration-200 ${formData.paymentMethod === 'MOMO'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md'
                        : 'border-gray-300 hover:border-pink-300 hover:shadow-sm'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">📱</div>
                        <div>MOMO</div>
                      </div>
                    </button>


                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={registerCoure}
                  disabled={isLoading}
                  className={`w-full py-4 px-4 rounded-md font-semibold transition-all duration-200 ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-900'
                    } text-white shadow-md hover:shadow-lg`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Đăng ký ngay'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Các trường bắt buộc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Course Benefits Section */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Tại sao chọn khóa học của chúng tôi?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courseBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-gradient-to-b from-white to-gray-50"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800">
                {benefit.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCourse;
