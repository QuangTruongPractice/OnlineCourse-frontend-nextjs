"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Clock, Users, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import api, { endpoints, formatDuration } from '../../utils/api';
import Link from "next/link";

interface Course {
  id: number;
  subject: string;
  image: string;
  category: number;
  lecturer: number;
  name: string;
  description: string;
  price: string;
  level: string;
  duration: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

interface CoursesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

const CourseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);

  const loadCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get(endpoints["courses"]);
      console.log('Courses response:', res.data);

      const data = res.data as CoursesResponse;
      if (data && data.results) {
        setCourses(data.results);
        setTotalCourses(data.count);
      } else {
        setCourses([]);
        setTotalCourses(0);
      }
    } catch (error) {
      console.error("Failed to load courses", error);
      setCourses([]);
      setTotalCourses(0);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (): Promise<void> => {
    try {
      const res = await api.get(endpoints["categories"]);
      console.log('Categories response:', res.data);

      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data as Category[]);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategories([]);
    }
  };

  const loadTeachers = async (): Promise<void> => {
    try {
      const res = await api.get(endpoints.teacher);
      console.log('Teachers response:', res.data);

      if (res.data && Array.isArray(res.data)) {
        setTeachers(res.data as Teacher[]);
      } else if (res.data && (res.data as any).results) {
        setTeachers((res.data as any).results as Teacher[]);
      }
    } catch (error) {
      console.error("Failed to load teachers", error);
      setTeachers([]);
    }
  };

  useEffect(() => {
    loadCourses();
    loadCategories();
    loadTeachers();
  }, []);

  const priceRanges = [
    { value: '', label: 'Tất cả' },
    { value: 'under_100k', label: 'Dưới 100,000đ' },
    { value: '100k_500k', label: '100,000đ - 500,000đ' },
    { value: '500k_1m', label: '500,000đ - 1,000,000đ' },
    { value: 'over_1m', label: 'Trên 1,000,000đ' }
  ];

  const levelLabels: Record<string, string> = {
    'so_cap': 'Sơ cấp',
    'trung_cap': 'Trung cấp',
    'nang_cao': 'Nâng cao'
  };

  const checkPriceRange = (price: string, range: string): boolean => {
    const priceValue = parseFloat(price);

    switch (range) {
      case 'under_100k':
        return priceValue < 100000;
      case '100k_500k':
        return priceValue >= 100000 && priceValue <= 500000;
      case '500k_1m':
        return priceValue >= 500000 && priceValue <= 1000000;
      case 'over_1m':
        return priceValue > 1000000;
      case '':
      default:
        return true;
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Chưa phân loại';
  };

  const getTeacherName = (teacherId: number): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown";
  };

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || course.category.toString() === selectedCategory;

    const matchesInstructor = !selectedInstructor || course.lecturer.toString() === selectedInstructor;

    const matchesPrice = checkPriceRange(course.price, priceRange);

    return matchesSearch && matchesCategory && matchesInstructor && matchesPrice;
  });

  const resetFilters = (): void => {
    setSelectedCategory('');
    setSelectedInstructor('');
    setPriceRange('');
    setSearchTerm('');
  };

  const getCourseIcon = (categoryId: number): string => {
    const icons: Record<number, string> = {
      1: '💻',
      2: '⚙️',
      3: '🔒',
      4: '📊'
    };
    return icons[categoryId] || '💻';
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      'so_cap': 'bg-green-100 text-green-800',
      'trung_cap': 'bg-blue-100 text-blue-800',
      'nang_cao': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: string): string => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header and Search */}
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-16">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Khám phá kiến thức mới
          </h1>
          <p className="text-gray-600 mb-8 text-sm lg:text-base">Hàng ngàn khóa học chất lượng từ những giảng viên hàng đầu đang chờ đón bạn</p>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors h-5 w-5" />
            <input
              type="text"
              placeholder="Bạn muốn học gì hôm nay? (Vd: React, Python...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-white bg-white shadow-xl shadow-blue-500/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base lg:text-lg outline-none"
            />
          </div>
        </div>

        {/* Filter Toggle and Results Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm font-semibold text-gray-700"
          >
            <Filter className="h-4 w-4" />
            <span>Bộ lọc tìm kiếm</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500 font-medium">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              {filteredCourses.length} kết quả
            </span>
            <span>Tổng cộng: {totalCourses}</span>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-white p-6 lg:p-8 mb-10 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Danh mục</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Giảng viên</label>
                <select
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                >
                  <option value="">Tất cả giảng viên</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id.toString()}>
                      {teacher.first_name} {teacher.last_name || `Giảng viên ${teacher.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Khoảng giá</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end pt-2">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-3 bg-slate-100 text-gray-600 rounded-xl hover:bg-slate-200 transition-all font-bold"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || selectedInstructor || priceRange || searchTerm) && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                      Từ khóa: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-900 transition-colors">×</button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                      {getCategoryName(parseInt(selectedCategory))}
                      <button onClick={() => setSelectedCategory('')} className="ml-2 hover:text-emerald-900 transition-colors">×</button>
                    </span>
                  )}
                  {selectedInstructor && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                      {getTeacherName(parseInt(selectedInstructor))}
                      <button onClick={() => setSelectedInstructor('')} className="ml-2 hover:text-purple-900 transition-colors">×</button>
                    </span>
                  )}
                  {priceRange && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                      {priceRanges.find(r => r.value === priceRange)?.label}
                      <button onClick={() => setPriceRange('')} className="ml-2 hover:text-amber-900 transition-colors">×</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Info for Mobile */}
        <div className="sm:hidden mb-6 flex justify-between items-center px-1">
          <p className="text-sm font-medium text-gray-500">
            Tìm thấy <span className="text-blue-600 font-bold">{filteredCourses.length}</span> khóa học
          </p>
          <span className="text-xs text-gray-400">Tổng: {totalCourses}</span>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 flex flex-col h-full">
              {/* Course Image */}
              <div className="relative h-48 lg:h-52 overflow-hidden flex-shrink-0">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
                    <div className="text-white text-center transform group-hover:scale-110 transition-transform duration-500">
                      <div className="text-5xl mb-3 opacity-90">{getCourseIcon(course.category)}</div>
                      <h3 className="font-bold text-sm line-clamp-2 leading-tight uppercase tracking-wider">{course.name}</h3>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-white/20 backdrop-blur-md ${getLevelColor(course.level)}`}>
                    {levelLabels[course.level] || course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-5 lg:p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-widest border border-blue-100">
                    {getCategoryName(course.category)}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {course.name}
                </h3>

                <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-1 italic leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-xs">
                      👤
                    </div>
                    <span className="truncate">{getTeacherName(course.lecturer)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs font-semibold">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                      {formatDuration(course.duration)}
                    </div>
                    <div className="text-xl font-black text-blue-600 tracking-tight">
                      {formatPrice(course.price)}đ
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/course/${course.id}`}
                    className="block w-full px-4 py-3.5 bg-slate-900 group-hover:bg-blue-600 text-white rounded-xl transition-all duration-300 font-bold text-center text-sm tracking-wide shadow-lg shadow-slate-200"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && !loading && (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white mt-10">
            <div className="text-7xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              Ôi không!
            </h3>
            <p className="text-gray-500 mb-8 px-6 leading-relaxed">
              Chúng tôi không tìm thấy khóa học nào phù hợp với yêu cầu của bạn. Thử tìm kiếm với từ khóa khác nhé!
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Đặt lại tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSearch;